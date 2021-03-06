import he from "he";
import SmartView from "./smart";
import {formatFilmDuration, formatFullFilmRelease, formatCommentDate} from "../utils/film";
import {EMOJIES} from "../constants";

const createFilmDetailsTable = (data) => {
  const {director, writers, actors, release, duration, country, genres} = data;

  return `<table class="film-details__table">
    <tr class="film-details__row">
      <td class="film-details__term">Director</td>
      <td class="film-details__cell">${director}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Writers</td>
      <td class="film-details__cell">${writers.join(`, `)}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Actors</td>
      <td class="film-details__cell">${actors.join(`, `)}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Release Date</td>
      <td class="film-details__cell">${formatFullFilmRelease(release)}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Runtime</td>
      <td class="film-details__cell">${formatFilmDuration(duration)}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">Country</td>
      <td class="film-details__cell">${country}</td>
    </tr>
    <tr class="film-details__row">
      <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
      <td class="film-details__cell">
        ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``)}
      </td>
    </tr>
  </table>`;
};

const createFilmsDetailComments = (comments, isDeletingComment, deletingComment) => {
  return comments.map(({id, name, date, emoji, message}) => `<li class="film-details__comment" data-id="${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(message)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${name}</span>
        <span class="film-details__comment-day">${formatCommentDate(date)}</span>
        <button class="film-details__comment-delete" ${isDeletingComment ? `disabled` : ``}>${deletingComment === id ? `Deleting...` : `Delete`}</button>
      </p>
    </div>
  </li>`).join(``);
};

const createFilmsDetailAddComment = (selectedEmoji, message, isSavingComment) => {
  return `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">${selectedEmoji ? `<img src="images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}">` : ``}</div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isSavingComment ? `disabled` : ``}>${message}</textarea>
    </label>

    <div class="film-details__emoji-list">
     ${EMOJIES.map((emoji) => `<input
        class="film-details__emoji-item visually-hidden"
        name="comment-emoji"
        type="radio"
        id="emoji-${emoji}"
        value="${emoji}"
        ${selectedEmoji === emoji ? `checked` : ``}
        ${isSavingComment ? `disabled` : ``}
      >
      <label class="film-details__emoji-label" for="emoji-${emoji}">
        <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
      </label>`).join(``)}
    </div>
  </div>`;
};

const createFilmDetailsTemplate = (data, comments) => {
  const {
    poster,
    title,
    titleOriginal,
    rating,
    description,
    age,
    isWatch,
    isWatched,
    isFavorite,
    showComments,
    selectedEmoji,
    message,
    isSavingComment,
    isDeletingComment,
    deletingComment
  } = data;


  const tableTemplate = createFilmDetailsTable(data);

  const commentsTemplate = showComments ? createFilmsDetailComments(comments, isDeletingComment, deletingComment) : ``;

  const addCommentTemplate = createFilmsDetailAddComment(selectedEmoji, message, isSavingComment);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${age}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${titleOriginal}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            ${tableTemplate}

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatch ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsTemplate}
          </ul>

          ${addCommentTemplate}
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmPopup extends SmartView {
  constructor(film, comments) {
    super();

    this._comments = comments;
    this._data = this._parseFilmToData(film);

    this._popupScrollHandler = this._popupScrollHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);

    this._setHandlers();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._data, this._comments);
  }

  updateElement() {
    super.updateElement();

    this.getElement().scroll(0, this._data.scrollTop);
  }

  getData() {
    return this._data;
  }

  restoreHandlers() {
    this._setHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
  }

  _setHandlers() {
    this.getElement().addEventListener(`scroll`, this._popupScrollHandler);
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`change`, this._emojiChangeHandler);
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentInputHandler);
  }

  _parseFilmToData(film) {
    const data = Object.assign({}, film, {
      showComments: this._comments !== null ? this._comments.length > 0 : false,
      scrollTop: 0,
      selectedEmoji: null,
      message: ``,
      isSavingComment: false,
      isDeletingComment: false,
      deletingComment: null
    });

    return data;
  }

  _popupScrollHandler() {
    this.updateData({
      scrollTop: this.getElement().scrollTop
    });
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _deleteCommentClickHandler(evt) {
    if (!evt.target.classList.contains(`film-details__comment-delete`)) {
      return;
    }

    evt.preventDefault();
    const id = evt.target.closest(`.film-details__comment`).dataset.id;
    this._callback.deleteCommentClick(id);
  }

  _emojiChangeHandler(evt) {
    this.updateData({
      selectedEmoji: evt.target.value
    }, true);
  }

  _commentInputHandler(evt) {
    this.updateData({
      message: evt.target.value
    });
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteCommentClick = callback;
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, this._deleteCommentClickHandler);
  }
}
