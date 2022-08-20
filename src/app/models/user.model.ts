export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
}

//Omit no queremos enviar el id
export interface CreateUserDTO extends Omit<User, 'id'>{}
  