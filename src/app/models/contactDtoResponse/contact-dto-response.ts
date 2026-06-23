export interface contactDtoResponse {
  totalRows: number
  successCount: number
  failedCount: number
  countactList: CountactList[]
  errors: any[]
}

export interface CountactList {
  rowNumber: number
  name: string
  email: string
  phone: string
  company: string
  status: string
  statusId: number
  assignedTo: number
  isValid: boolean
  failReason: any
}
