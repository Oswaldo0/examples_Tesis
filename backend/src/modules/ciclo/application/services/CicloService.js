export class CicloService {
  constructor(repository) { this.repository = repository; }
  listAll() { return this.repository.findAll(); }
  getById(id) { return this.repository.findById(id); }
  create(data) { return this.repository.create(data); }
  update(id, data) { return this.repository.update(id, data); }
  delete(id) { return this.repository.delete(id); }
}
