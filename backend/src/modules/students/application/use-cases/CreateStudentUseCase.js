import { Student } from '../../domain/entities/Student.js';
import { AppError } from '../../../../shared/errors/AppError.js';

export class CreateStudentUseCase {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  execute(data) {
    if (!data.expediente || !data.nombres || !data.apellidos) {
      throw new AppError('expediente, nombres y apellidos son requeridos', 400);
    }
    const student = new Student(data);
    return this.studentRepository.create(student);
  }
}
