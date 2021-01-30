import Observer from "../utils/ovserver";

export default class Comments extends Observer {
  constructor() {
    super();

    this._comments = {};
  }

  setComments(id, comments) {
    this._comments[id] = comments;
  }

  getComments(id) {
    if (!this._comments[id]) {
      return null;
    }

    return this._comments[id];
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
      comment: comment.message,
      date: comment.date instanceof Date ? comment.date.toISOString() : comment.date,
      emotion: comment.emoji
    });

    delete adaptedComment.name;
    delete adaptedComment.message;
    delete adaptedComment.emoji;

    return adaptedComment;
  }
}
