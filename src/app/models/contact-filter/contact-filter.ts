export class ContactFilter {
  searchText: string = '';
  status: number = -1;
  assignedTo: number = -1;
  pageNumber: number = 1;
  pageSize: number = 10;
  sub_id: string = '';

  toPayload(): any {
    return {
      searchText: this.searchText?.trim().length >= 3 ? this.searchText.trim() : null,
      status: this.status || -1,
      assignedTo: this.assignedTo || -1,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sub_id: this.sub_id
    };
  }
}

export interface ContactDto {
  id: number;
  internal_code?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
  status_id?: number;
  assignedTo_id?: number;
  assignedTo?: string;
  createdDate: string;
  is_selected?: boolean;
}
export interface ContactListResponse {
  data: ContactDto[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}