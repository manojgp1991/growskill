export interface EmailTemplateModel {
  id: number
  sub_id: string
  user_id: number
  email_action_id: Number
  email_action_name?: string
  internal_code: string
  template_name: string
  email_body: string
  is_active: boolean
  action_type: number
  createdDate: string
}