import axios from 'axios';
import { Request, Router } from 'express';
import env from '../../config';

const router = Router();

router.get('/', async (req: Request<{ url?: string }>, res) => {
  const { url: decodedURL } = req.query;
  const url = encodeURIComponent(`${decodedURL}`);

  if (!url) {
    res.status(400).send();
    return;
  }

  try {
    const { data } = await axios.get(
      `https://opengraph.io/api/1.1/site/${url}/?app_id=${env.OPEN_GRAPH_IO_ID}`
    );

    const { openGraph, htmlInferred } = data;
    const meta = {
      title: openGraph?.title ?? htmlInferred?.title,
      description: openGraph?.description ?? htmlInferred?.description,
      image: openGraph?.image?.url ?? htmlInferred?.image,
    };

    res.status(200).json(meta);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

export default router;
