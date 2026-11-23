export const FORUMS = [
  'nasa',
  'esports-tribunal',
  'notNasa',
];

const initialMessages = {
  nasa: [
    {
      id: '10000000-0000-4000-8000-000000000001',
      author: 'Space Explorer',
      text: 'Welcome to the space discussion!',
      timestamp: '2026-01-01T08:00:00.000Z',
    },
    {
      id: '10000000-0000-4000-8000-000000000002',
      author: 'Orbit Watcher',
      text: 'Sharing some interesting astronomy facts.',
      timestamp: '2026-01-01T09:00:00.000Z',
    },
  ],

  'esports-tribunal': [
    {
      id: '20000000-0000-4000-8000-000000000001',
      author: 'Arena Fan',
      text: 'Welcome to the esports discussion!',
      timestamp: '2026-01-01T08:00:00.000Z',
    },
    {
      id: '20000000-0000-4000-8000-000000000002',
      author: 'Game Observer',
      text: 'What makes a competitive match exciting?',
      timestamp: '2026-01-01T09:00:00.000Z',
    },
  ],

  notNasa: [
    {
      id: '30000000-0000-4000-8000-000000000001',
      author: 'Curious Member',
      text: 'Welcome to this community!',
      timestamp: '2026-01-01T08:00:00.000Z',
    },
    {
      id: '30000000-0000-4000-8000-000000000002',
      author: 'Friendly Member',
      text: 'Feel free to share your ideas here.',
      timestamp: '2026-01-01T09:00:00.000Z',
    },
  ],
};

let messages = structuredClone(initialMessages);

export function getMessagesByForum(forum) {
  if (!FORUMS.includes(forum)) {
    return null;
  }

  return messages[forum];
}

export function addMessage(forum, message) {
  if (!FORUMS.includes(forum)) {
    return null;
  }

  messages[forum].push(message);
  return message;
}

export function reset() {
  messages = structuredClone(initialMessages);
}
