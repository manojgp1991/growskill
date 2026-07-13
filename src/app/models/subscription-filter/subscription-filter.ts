export class SubscriptionFilter {
  searchText: string = '';
  status: number = -1;
  pageNumber: number = 1;
  pageSize: number = 10;
  internal_code: string = '';
  role_id: number = 0;

  toPayload(): any {
    return {
      searchText: this.searchText?.trim().length >= 3 ? this.searchText.trim() : null,
      status: this.status || -1,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      internal_code: this.internal_code,
      role_id: this.role_id,
    };
  }
}