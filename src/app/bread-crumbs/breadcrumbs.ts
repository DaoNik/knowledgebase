import { Params } from "@angular/router";

export interface IBreadcrumbs {
  displayName: string;
  url: string;
  params: Params;
}
