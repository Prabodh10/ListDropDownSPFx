import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IListDropDOwnProps {
  //description: string;
  selectedList: string;

  // isDarkTheme: boolean;
  // environmentMessage: string;
  // hasTeamsContext: boolean;
  // userDisplayName: string;


    //new code
  context: WebPartContext;
  listItems: any[]; // Add this property

  //new code
}

// export interface IListDropDOwnProps {
//   selectedList: string;
// }
