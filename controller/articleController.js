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

// exports.getArticles = async (req, res) => {
//   try {
//     const page = req.query.page || 1; // Get the requested page number from the query parameters
//     const itemsPerPage = 10; // Define the number of items to return per page
//     const topItemsCount = 4; // Define the number of items to include in the top results

//     const skip = (page - 1) * itemsPerPage;

//     // Retrieve articles with sorting and pagination
//     const allArticles = await Article.find()
//       .sort({ date: -1 }) // Sort by date in descending order
//       .skip(skip) // Skip the specified number of items
//       .limit(itemsPerPage); // Limit the number of items per page

//     // Split the results into top and other articles
//     const topArticles = allArticles.slice(0, topItemsCount);
//     const otherArticles = allArticles.slice(topItemsCount);

//     res.status(200).json({ topArticles, otherArticles });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.getArticles = async (req, res) => {
  console.log(req.body,"uhuh");

  try {
    console.log(req.query); // Log the query object to check received parameters
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = 10; // Number of articles to send per page

    // Calculate the skip value based on the page number and page size
    const skip = (page - 1) * pageSize;

    // Query the database to get a subset of articles based on pagination parameters
    const articles = await Article.find().skip(skip).limit(pageSize);

    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
