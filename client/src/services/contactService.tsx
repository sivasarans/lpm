import { POST_CALL_AUTH , UPLOAD_POST_CALL_AUTH ,GET_CALL_AUTH ,UPDATE_CALL_AUTH ,DELETE_CALL_AUTH} from "./index";

export const contactService = {
  getContacts,
  getSalutations,
  updateSalutations,
  getContact,
  getContactsByType,
  createContact,
  updateContact,
  deleteContact,
  importContacts,
  getLogs,
  exportLogs,
  clearAll,
};

function getContacts(type:any) {
  return GET_CALL_AUTH("/contacts/type/"+type);
}
function getContactsByType(data:object) {
  return POST_CALL_AUTH("/contacts/types/",data);
}


function getContact(id : any) {
  return GET_CALL_AUTH("/contacts/"+id);
}

function getSalutations(id:any) {
  return GET_CALL_AUTH("/contacts/salutations/"+id);
}

function updateSalutations(data: any) {
  return POST_CALL_AUTH("/contacts/salutations", data);
}

function createContact(data: any) {
  return POST_CALL_AUTH("/contacts", data);
}

function importContacts(data: any) {
  return UPLOAD_POST_CALL_AUTH("/contacts/importContacts", data);
}

function updateContact(data: any,id : any) {
  return UPDATE_CALL_AUTH("/contacts/"+id, data);
}
function deleteContact(id : number) {
  return DELETE_CALL_AUTH("/contacts/delete/"+id);
}

function getLogs(id:any) {
  return GET_CALL_AUTH("/contacts/failedContacts/"+id);
}

function exportLogs(id:any) {
  return GET_CALL_AUTH("/contacts/exportFailedContacts/"+id);
}
function clearAll(id : any) {
  return DELETE_CALL_AUTH("/contacts/clearAll/"+id);
}