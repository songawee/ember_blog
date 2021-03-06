window.App = Ember.Application.create();

App.Store = DS.Store.extend({
  revision: 11
});

/* Models */
App.Post = DS.Model.extend({
  title: DS.attr('string'),
  text: DS.attr('string')
});

App.ApplicationSerializer = DS.RESTSerializer.extend({
  primaryKey: function(type){
    return '_id';
  }.property()
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api'
});

/* Routes */
App.Router.map(function() {
  this.resource('posts', function() {
    this.resource('post', { path: ':post_id' })
  });
  this.resource('newPost');
});

App.PostsRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('post');
  }, 
  
  setupController: function() {
    var posts = this.store.filter('post', function (post) {
      return !post.get('isDirty');
    });
  
    this.controllerFor('posts').set('model', posts);
  } 
});

App.NewPostRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('post');
  }
});

/* Controllers */
App.PostsController = Ember.ArrayController.extend({
});

App.NewPostController = Ember.ObjectController.extend({
  title: null,
  text: null,

  actions: {
    createPost: function() {
      if (!(this.get('title') == undefined || this.get('text') == undefined)){
        var title, text;
    
        title = this.get('title').trim();
        text = this.get('text').trim();

        var post = this.get('store').createRecord('post', {
          title: title,
          text: text
        });

        this.set('title', '');
        this.set('text', '');

        this.transitionToRoute('posts');
        post.save();
      }
      else {
        console.log('fields not filled in');
      }
    }
  },

  newRecord: function() {
    this.set('content', App.Post);
  } 
});
