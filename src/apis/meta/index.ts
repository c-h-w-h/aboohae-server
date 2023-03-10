import { Request, Router } from 'express';

import ogs from 'open-graph-scraper';

const router = Router();

router.get('/', async (req: Request<{ url?: string }>, res) => {
  const { url: decodedURL } = req.query;
  const url = encodeURIComponent(`${decodedURL}`);

  if (!url) {
    res.status(400).send();
    return;
  }

  try {
    const { error, result } = await ogs({ url });
    if (error) throw error;

    const { ogTitle: title, ogDescription: description, ogImage: image } = result;

    const meta = { title, description, image: image };
    res.status(200).json(meta);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

export default router;
