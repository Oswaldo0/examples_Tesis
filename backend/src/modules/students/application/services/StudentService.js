export class StudentService {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  listStudents() {
    return this.studentRepository.findAll();
  }

  getStudent(expediente) {
    return this.studentRepository.findByExpediente(expediente);
  }

  updateStudent(expediente, data) {
    return this.studentRepository.update(expediente, data);
  }

  deleteStudent(expediente) {
    return this.studentRepository.delete(expediente);
  }
}
