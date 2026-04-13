export class Student {
  constructor({ id, name, status = 'active' }) {
    this.id = id;
    this.name = name;
    this.status = status;
  }
}
