import * as React from 'react';
import styles from './ListDropDOwn.module.scss';
import { IListDropDOwnProps } from './IListDropDOwnProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
//import { WebPartContext } from '@microsoft/sp-webpart-base';

export default class ListDropDOwn extends React.Component<IListDropDOwnProps, { listItems: any[] }> {

  constructor(props: IListDropDOwnProps) {
    super(props);

    this.state = {
      listItems: props.listItems || [],
    };
  }

  public async componentDidMount() {
    // if (!this.props.listItems || this.props.listItems.length === 0) {
    //   const listItems = await this._fetchListItems(this.props.selectedList);
    //   this.setState({ listItems });
    // }

    this.updateListItems(this.props.selectedList);
  }

  public componentDidUpdate(prevProps: IListDropDOwnProps) {
    if (this.props.selectedList !== prevProps.selectedList) {
      this.updateListItems(this.props.selectedList);
    }
  }

  private async updateListItems(selectedList: string): Promise<void> {
    const { context } = this.props;

    try {
      const response: SPHttpClientResponse = await context.spHttpClient.get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${selectedList}')/items?$select=Title`,
        SPHttpClient.configurations.v1
      );

      if (response.ok) {
        const data = await response.json();
        this.setState({ listItems: data.value });
      } else {
        console.error(`Error fetching list items: ${response.statusText}`);
        this.setState({ listItems: [] });
      }
    } catch (error) {
      console.error('Error fetching list items:', error);
      this.setState({ listItems: [] });
    }
  }




  // private async _fetchListItems(selectedList: string): Promise<any[]> {
  //   const { context } = this.props;

  //   try {
  //     const response: SPHttpClientResponse = await context.spHttpClient.get(
  //       `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${selectedList}')/items?$select=Title`,
  //       SPHttpClient.configurations.v1
  //     );

  //     if (response.ok) {
  //       const data = await response.json();
  //       return data.value;
  //     } else {
  //       console.error(`Error fetching list items: ${response.statusText}`);
  //       return [];
  //     }
  //   } catch (error) {
  //     console.error('Error fetching list items:', error);
  //     return [];
  //   }
  // }

  public render(): React.ReactElement<IListDropDOwnProps> {
    const { listItems } = this.state;

    return (
      <section className={`${styles.ListDropDOwn}`}>
        <div className={styles.welcome}>
          <div>Web part property value: <strong>{escape(this.props.selectedList)}</strong></div>
          {/* <div className={styles.welcome}>Title</div> */}
          <ul>
            {listItems.map((item) => (
              <li key={item.Id}>{item.Title}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
}
