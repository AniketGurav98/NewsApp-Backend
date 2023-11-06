const Article = require('../model/article');

exports.addArticle = async (req, res) => {
  try {
    const { article, headline ,img} = req.body;
    
    // Access the uploaded file details
    console.log(img,"ttttttttttt");

    
    // Create a new article with the image path and other details
    const newArticle = new Article({
      img,
      article,
      headline
    });

    // Save the article to the database
    await newArticle.save();

    res.status(201).json({ message: 'Article created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
