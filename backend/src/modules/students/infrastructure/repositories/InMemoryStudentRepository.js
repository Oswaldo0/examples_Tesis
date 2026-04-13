import { IStudentRepository } from '../../domain/repositories/IStudentRepository.js';

export class InMemoryStudentRepository extends IStudentRepository {
  constructor() {
    super();
    this.students = [];
  }

  findAll() {
    return this.students;
  }

  create(student) {
    this.students.push(student);
    return student;
  }
}
