import { MySQLStudentRepository } from '../../infrastructure/repositories/MySQLStudentRepository.js';
import { StudentService } from '../../application/services/StudentService.js';
import { CreateStudentUseCase } from '../../application/use-cases/CreateStudentUseCase.js';
import { AppError } from '../../../../shared/errors/AppError.js';

const repository = new MySQLStudentRepository();
const studentService = new StudentService(repository);
const createStudentUseCase = new CreateStudentUseCase(repository);

export class StudentController {
  static async getAll(_req, res, next) {
    try {
      res.status(200).json(await studentService.listStudents());
    } catch (err) { next(err); }
  }

  static async getOne(req, res, next) {
    try {
      const student = await studentService.getStudent(req.params.expediente);
      if (!student) throw new AppError('Estudiante no encontrado', 404);
      res.status(200).json(student);
    } catch (err) { next(err); }
  }

  static async create(req, res, next) {
    try {
      res.status(201).json(await createStudentUseCase.execute(req.body));
    } catch (err) { next(err); }
  }

  static async update(req, res, next) {
    try {
      const updated = await studentService.updateStudent(req.params.expediente, req.body);
      if (!updated) throw new AppError('Estudiante no encontrado', 404);
      res.status(200).json(updated);
    } catch (err) { next(err); }
  }

  static async remove(req, res, next) {
    try {
      await studentService.deleteStudent(req.params.expediente);
      res.status(204).send();
    } catch (err) { next(err); }
  }
}
