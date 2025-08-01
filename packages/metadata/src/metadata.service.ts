/**
 * Service for fetching page metadata from URLs
 */

export interface PageMetadata {
  title: string;
  description?: string;
}

/**
 * Fetches the title and description from a webpage
 */
export async function fetchPageMetadata(url: string): Promise<PageMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let title = titleMatch?.[1]?.trim() || '';

    // If no title found, try og:title
    if (!title) {
      const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i);
      title = ogTitleMatch?.[1]?.trim() || '';
    }

    // If still no title, try twitter:title
    if (!title) {
      const twitterTitleMatch = html.match(
        /<meta[^>]*name="twitter:title"[^>]*content="([^"]*)"[^>]*>/i,
      );
      title = twitterTitleMatch?.[1]?.trim() || '';
    }

    // Extract description
    let description = '';

    // Try meta description first
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
    description = descMatch?.[1]?.trim() || '';

    // If no description, try og:description
    if (!description) {
      const ogDescMatch = html.match(
        /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i,
      );
      description = ogDescMatch?.[1]?.trim() || '';
    }

    // If still no description, try twitter:description
    if (!description) {
      const twitterDescMatch = html.match(
        /<meta[^>]*name="twitter:description"[^>]*content="([^"]*)"[^>]*>/i,
      );
      description = twitterDescMatch?.[1]?.trim() || '';
    }

    // Decode HTML entities
    title = decodeHtmlEntities(title);
    description = decodeHtmlEntities(description);

    // Fallback to URL if no title found
    if (!title) {
      try {
        const urlObj = new URL(url);
        title = urlObj.hostname;
      } catch {
        title = 'Shared Link';
      }
    }

    return {
      title,
      description: description || undefined,
    };
  } catch (error) {
    console.error('Error fetching page metadata:', error);

    // Fallback: extract hostname from URL
    try {
      const urlObj = new URL(url);
      return {
        title: urlObj.hostname,
      };
    } catch {
      return {
        title: 'Shared Link',
      };
    }
  }
}

/**
 * Decode common HTML entities
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
  };

  return text.replace(/&[#\w]+;/g, (entity) => {
    return entities[entity] || entity;
  });
}