export class StudentService {
  constructor(studentRepository) {
    this.studentRepository = studentRepository;
  }

  listStudents() {
    return this.studentRepository.findAll();
  }
}
