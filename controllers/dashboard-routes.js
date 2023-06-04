const dashboardRouter = require("express").Router();
const { PostModel } = require("../models");
const withAuth = require("../utils/auth");

dashboardRouter.get("/", withAuth, (req, res) => {
  PostModel.findAll({
    where: {
      userId: req.session.userId
    }
  })
    .then(dbPostData => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));

      res.render("all-posts-admin", {
        layout: "dashboard",
        posts
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect("login");
    });
});

dashboardRouter.get("/new", withAuth, (req, res) => {
  res.render("new-post", {
    layout: "dashboard"
  });
});

dashboardRouter.get("/edit/:id", withAuth, (req, res) => {
  PostModel.findByPk(req.params.id)
    .then(dbPostData => {
      if (dbPostData) {
        const post = dbPostData.get({ plain: true });

        res.render("edit-post", {
          layout: "dashboard",
          post
        });
      } else {
        res.status(404).end();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = dashboardRouter;
