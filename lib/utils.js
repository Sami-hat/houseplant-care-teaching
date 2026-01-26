export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function stripJsonFromResponse(message) {
  let content = '';
  if (typeof message === 'string') {
    content = message;
  } else if (message?.parts) {
    content = message.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('');
  } else if (message?.content) {
    content = message.content;
  }
  return content.replace(/\{"understood".*?\}/g, '').trim();
}

export function parseAssessmentJson(content) {
  const match = content.match(/\{"understood":\s*(true|false),\s*"mastery_delta":\s*(-?\d+)\}/);
  if (match) {
    return {
      understood: match[1] === 'true',
      masteryDelta: parseInt(match[2], 10),
    };
  }
  return null;
}
