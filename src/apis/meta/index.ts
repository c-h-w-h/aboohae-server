import axios from 'axios';
import { load } from 'cheerio';
import { Request, Router } from 'express';

const OG_PROPERTIES = ['og:title', 'og:description', 'og:image'];

const router = Router();

router.get('/', async (req: Request<{ url?: string }>, res) => {
  const { url } = req.query;

  if (!url) {
    res.status(400).send();
    return;
  }

  try {
    const { data } = await axios.get(`${url}`);

    const $ = load(data);

    const title = $('title').text();

    const meta = [...$('meta')].reduce(
      (prev, el) => {
        const $el = $(el);
        const property = $el.attr('property');

        if (OG_PROPERTIES.includes(property)) {
          const key = property.replace('og:', '');
          const value = $el.attr('content');

          return { ...prev, [key]: value };
        }

        return prev;
      },
      { title, description: title, image: '' }
    );

    res.status(200).json(meta);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

export default router;
