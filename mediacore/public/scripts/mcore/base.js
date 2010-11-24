/**
 * This file is a part of MediaCore, Copyright 2010 Simple Station Inc.
 *
 * MediaCore is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MediaCore is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

goog.provide('mcore');
goog.provide('mcore.initPage');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('mcore.comments.CommentForm');
goog.require('mcore.excerpts.Excerpt');
goog.require('mcore.likes.LikeThis');
goog.require('mcore.players.initHtml5Player');


/**
 * Setup all the page elements. This should be called at the bottom of
 * the document.
 */
mcore.initPage = function() {
  var likeButtons = goog.dom.getElementsByTagNameAndClass('a', 'meta-likes');
  goog.array.forEach(likeButtons, function(element) {
    var like = new mcore.likes.LikeThis();
    like.decorate(element);
  });

  var mediaBox = goog.dom.getElement('media-box');
  if (mediaBox) {
    var commentForm = goog.dom.getElement('post-comment-form');
    if (commentForm) {
      var cf = new mcore.comments.CommentForm();
      cf.decorate(commentForm);
    }

    var excerpt = goog.dom.getElement('description-excerpt');
    if (excerpt &&
        goog.dom.getElementsByClass('mcore-excerpt', excerpt).length) {
      var exc = new mcore.excerpts.Excerpt();
      exc.decorate(excerpt);
      exc.showExcerpt(true);
    }
  }
};


/**
 * Decorate an HTML5 video or audio player and attach a fallback handler
 * for when the browser does not support it.
 * @param {Element|string} element A video or audio tag, or its ID.
 * @param {Function|string=} opt_fallback Fallback HTML or a function to call.
 * @param {Function|boolean=} opt_preferFallback Attempt the fallback first.
 * @return {mcore.players.Html5Player|null} The new html5 player instance.
 */
mcore.initHtml5Player = function(element, opt_fallback,
                                 opt_preferFallback) {
  element = goog.dom.getElement(element);
  if (goog.isNull(element)) {
    return null;
  }

  var player = new mcore.players.Html5Player();

  var fallback;
  if (goog.isFunction(opt_fallback)) {
    fallback = opt_fallback;
  } else if (goog.isString(opt_fallback)) {
    fallback = function(e) {
      var mediaElement = player.getElement();
      player.dispose();
      element.innerHTML = opt_fallback;
    };
  }
  if (fallback) {
    goog.events.listen(player,
        [mcore.players.EventType.NO_SUPPORT,
         mcore.players.EventType.NO_SUPPORTED_SRC],
        fallback);
  }

  player.decorate(goog.dom.getFirstElementChild(element));
  return player;
};


goog.exportSymbol('mcore.initPage', mcore.initPage);
goog.exportSymbol('mcore.initHtml5Player', mcore.initHtml5Player);