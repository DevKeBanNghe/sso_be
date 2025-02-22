interface CreateService<T = unknown> {
  create(createDto: T);
}

interface UpdateService<T = unknown> {
  update(updateDto: T | T[]);
}

interface DeleteService<T = string[]> {
  remove(ids: T);
}

interface GetDetailService<T = string> {
  getDetail(id: T);
}

interface GetAllService<T = unknown> {
  getAll(getAllDto?: T);
}

interface GetOptionsService<T = unknown> {
  getOptions(getOptionsDto?: T);
}

export {
  CreateService,
  UpdateService,
  DeleteService,
  GetDetailService,
  GetAllService,
  GetOptionsService,
};
