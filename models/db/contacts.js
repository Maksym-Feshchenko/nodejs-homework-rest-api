import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const filepath = path.resolve("models", "db", "contacts.json");

  export const listContacts = async () => {
    const data = await fs.readFile(filepath);
    return JSON.parse(data);
  }
  
  export const getContactById = async (id) => {
    const contact = await listContacts();
    const result = contact.find(item => item.id === id);
    return result || null;
  }
  
  export const removeContact = async (id) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === id);
    if (index === -1  ) {
      return null;
    }
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(filepath, JSON.stringify(contacts, null, 2));
    return result;
  }
  
  export const addContact = async ({name, email, phone}) => {
    const contacts = await listContacts();
    const newContact = {
      id: nanoid(),
      name,
      email, 
      phone,
    }
    contacts.push(newContact);
    await fs.writeFile(filepath, JSON.stringify(contacts, null, 2));
    return newContact;
  }

  export const UpdateContactById = async(id, {name, email, phone}) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === id);
    if(index === -1) {
      return null;
    }
    contacts[index] = {id, name, email, phone};
    await fs.writeFile(filepath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  }

  export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    UpdateContactById,
  }