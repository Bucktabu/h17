export class CommentBDConstructor {
  constructor(
    public id: string,
    public content: string,
    public userId: string,
    public userLogin: string,
    public createdAt: string,
    public postId?: string,
  ) {}
}
