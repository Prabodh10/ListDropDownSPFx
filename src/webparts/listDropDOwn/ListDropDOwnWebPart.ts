import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
 // PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ListDropDOwnWebPartStrings';
import ListDropDOwn from './components/ListDropDOwn';
import { IListDropDOwnProps } from './components/IListDropDOwnProps';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IListDropDOwnWebPartProps {
  selectedList: string;
 //listItems: any[];
}

export default class ListDropDOwnWebPart extends BaseClientSideWebPart<IListDropDOwnWebPartProps> {



  // private _isDarkTheme: boolean = false;
  // private _environmentMessage: string = '';
  private _siteLists: string[];

  public render(): void {
    const element: React.ReactElement<IListDropDOwnProps> = React.createElement(
      ListDropDOwn,
      {

        context: this.context,
        selectedList: this.properties.selectedList,
        listItems: [] // Pass the list items here
       // description: this.properties.description,
        //selectedList: this.properties.selectedList
        //isDarkTheme: this._isDarkTheme,
       // environmentMessage: this._environmentMessage,
       // hasTeamsContext: !!this.context.sdks.microsoftTeams,
       // userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {

    //console.log('init');

    this._siteLists = await this._getSiteLists();

    const listItems = await this._getListItems(this.properties.selectedList);
  console.log(listItems);
    // this.setState({
    //   listItems: listItems
    // });
    //console.log('lists', list);

    // return this._getEnvironmentMessage().then(message => {
    //   this._environmentMessage = message;
    // });
  }

  private async _getListItems(listTitle: string): Promise<any[]> {
    const endpoint: string = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listTitle}')/items?$select=Title`;
  
    const rawResponse: SPHttpClientResponse = await this.context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
    return (await rawResponse.json()).value;
  }


private async _getSiteLists(): Promise<string[]> {

const endpoint : string = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists?$select=Title&$filter eq false&$orderby=Title&$top=90`;

const rawResponse: SPHttpClientResponse = await this.context.spHttpClient.get(endpoint, SPHttpClient.configurations.v1);
return (await rawResponse.json()).value.map(
  (list: {Title: string}) => {
    return list.Title
  }
);


}

  // private _getEnvironmentMessage(): Promise<string> {
  //   if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
  //     return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
  //       .then(context => {
  //         let environmentMessage: string = '';
  //         switch (context.app.host.name) {
  //           case 'Office': // running in Office
  //             environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
  //             break;
  //           case 'Outlook': // running in Outlook
  //             environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
  //             break;
  //           case 'Teams': // running in Teams
  //             environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
  //             break;
  //           default:
  //             throw new Error('Unknown host');
  //         }

  //         return environmentMessage;
  //       });
  //   }

  //   return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  // }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

   // this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown('selectedList', {
                  label: 'Site Lists',
                  options: this._siteLists.map((list: string) =>{
                    return <IPropertyPaneDropdownOption>{
                      key: list,
                      text: list
                    }
                  })
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
