enum Status {
  ACTIVE,
  FINISHED,
}

interface Todo {
  id: number;
  text: string;
  status: Status;
}