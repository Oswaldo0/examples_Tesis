import { Student } from '../../domain/entities/Student.js';

export class CreateStudentUseCase {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  execute(data) {
    const student = new Student(data);
    return this.studentRepository.create(student);
  }
}
