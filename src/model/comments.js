import Observer from "../utils/ovserver";

export default class Comments extends Observer {
  constructor() {
    super();

    this._comments = {};
  }

  setComments(film, comments) {
    this._comments[film] = comments;
  }

  getComments(film) {
    if (!this._comments[film]) {
      return null;
    }

    return this._comments[film];
  }

  deleteComment(film, id) {
    const index = this._comments[film].findIndex((comment) => comment.id === id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments[film] = [
      ...this._comments[film].slice(0, index),
      ...this._comments[film].slice(index + 1)
    ];
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
