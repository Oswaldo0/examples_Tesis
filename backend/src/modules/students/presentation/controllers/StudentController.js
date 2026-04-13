import { InMemoryStudentRepository } from '../../infrastructure/repositories/InMemoryStudentRepository.js';
import { StudentService } from '../../application/services/StudentService.js';
import { CreateStudentUseCase } from '../../application/use-cases/CreateStudentUseCase.js';

const repository = new InMemoryStudentRepository();
const studentService = new StudentService(repository);
const createStudentUseCase = new CreateStudentUseCase(repository);

export class StudentController {
  static getAll(_req, res) {
    const students = studentService.listStudents();
    return res.status(200).json(students);
  }

  static create(req, res) {
    const created = createStudentUseCase.execute(req.body);
    return res.status(201).json(created);
  }
}
