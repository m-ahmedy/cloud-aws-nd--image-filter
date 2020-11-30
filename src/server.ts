import express from 'express';
import bodyParser from 'body-parser';
import { StatusCodes } from 'http-status-codes';
import { filterImageFromURL, deleteLocalFiles, validate_URL } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get('/filteredimage', async (req: express.Request, res: express.Response) => {
    if (!req.query || !req.query.image_url) {
      return res.status(StatusCodes.BAD_REQUEST).send("image_url query does not exist")
    }

    const image_url: string = req.query.image_url
    if (!validate_URL(image_url)) {
      return res.status(StatusCodes.BAD_REQUEST).send("image_url is not a valid image URL")
    }

    const image_file = await filterImageFromURL(image_url)
    res.sendFile(image_file)

    res.on('finish', () => {
      deleteLocalFiles()
    })
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: express.Request, res: express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
