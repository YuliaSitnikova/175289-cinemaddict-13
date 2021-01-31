import Observer from "../utils/ovserver";

export default class Comments extends Observer {
  constructor() {
    super();
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign({}, comment, {
      name: comment.author,
      message: comment.comment,
      date: new Date(comment.date),
      emoji: comment.emotion
    });

    delete adaptedComment.author;
    delete adaptedComment.comment;
    delete adaptedComment.emotion;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign({}, comment, {

    });

    return adaptedComment;
  }
}
