var options = {}

options.statuses = {
  speaker: [
    { name: 'Suggestion', id: 'suggestion', color: '#ff8f1f', default: true },
    { name: 'Selected', id: 'selected', color: '#5319e7' },
    { name: 'Approved', id: 'approved', color: '#0052cc' },
    { name: 'Contacted', id: 'contacted', color: '#fbca04' },
    { name: 'In Conversations', id: 'in-conversations', color: '#207de5' },
    { name: 'Accepted', id: 'accepted', color: '#009800' },
    { name: 'Rejected', id: 'rejected', color: '#e11d21' },
    { name: 'Give Up', id: 'give-up', color: '#333' },
    { name: 'Announced', id: 'announced', color: '#009800' }
  ],
  company: [
    { name: 'Suggestion', id: 'suggestion', color: '#ff8f1f', default: true },
    { name: 'Selected', id: 'selected', color: '#5319e7' },
    { name: 'Contacted', id: 'contacted', color: '#fbca04' },
    { name: 'In Conversations', id: 'in-conversations', color: '#207de5' },
    { name: 'In Negotiations', id: 'in-negotiations', color: '#006b75' },
    { name: 'Closed Deal', id: 'closed-deal', color: '#009800' },
    { name: 'Rejected', id: 'rejected', color: '#e11d21' },
    { name: 'Give Up', id: 'give-up', color: '#333' },
    { name: 'Announced', id: 'announced', color: '#009800' }
  ],
  communication: [
    { name: 'Pending Review...', id: 'pending-review', color: '#fbca04' },
    { name: 'Reviewed.', id: 'reviewed', color: '#e11d21' },
    { name: 'Approved!', id: 'approved', color: '#009800' }
  ],
  payment: [
    { name: 'Emmited', id: 'emmited', color: '#e11d21' },
    { name: 'Sent', id: 'sent', color: '#e11d21' },
    { name: 'Paid', id: 'paid', color: '#009800' }
  ]
}

options.vias = {
  payment: [
    { name: 'Mail', id: 'mail' },
    { name: 'Email', id: 'email' }
  ]
}

options.kinds = {
  communications: [
    'Initial Email Paragraph',
    'Email To',
    'Email From',
    'Meeting',
    'Phone Call'
  ],
  topics: [
    { name: 'IDEA', id: 'idea', color: '#5319e7' },
    { name: 'INFO', id: 'info', color: '#207de5' },
    { name: 'TODO', id: 'todo', color: '#fbca04' },
    { name: 'DECISION', id: 'decision', color: '#e11d21' },
    { name: 'MEETING', id: 'meeting', color: '#333' },
    { name: 'TUTORIAL', id: 'tutorial', color: '#333' }
  ],
  polls: [
    { name: 'Text', id: 'text', color: '#207de5' },
    { name: 'Images', id: 'images', color: '#5319e7' }
  ],
  sessions: [
    { id: 'keynote', name: 'Keynote', color: '#439BE8' },
    { id: 'meetup', name: 'Meetup', color: '#47F230' },
    { id: 'presentation', name: 'Presentation', color: '#5F4EF5' },
    { id: 'talk', name: 'Talk', color: '#FA8405' },
    { id: 'workshop', name: 'Workshop', color: '#F51414' }
  ]
}

options.advertisementLvl = [
  { name: 'Exclusive', id: 'exclusive' },
  { name: 'Maximum', id: 'max' },
  { name: 'Medium', id: 'med' },
  { name: 'Minimum', id: 'min' },
  { name: 'Media', id: 'media' },
  { name: 'Other', id: 'other' }
]

options.roles = [
  { name: 'Public Relations', id: 'public-relations' },
  { name: 'Marketing', id: 'marketing' },
  { name: 'Internal Relations', id: 'internal-relations' },
  { name: 'Events', id: 'events' },
  { name: 'Innovation Awards', id: 'innovation-awards' },
  { name: 'Design', id: 'design' },
  { name: 'Audiovisuals', id: 'audiovisuals' },
  { name: 'Development Team', id: 'development-team' },
  { name: 'Coordination', id: 'coordination' },
  { name: 'Treasury', id: 'treasury' },
  { name: 'External Relations', id: 'external-relations' },
  { name: 'Strategic Partnerships', id: 'strategic-partnerships' },
  { name: 'Sys Admin', id: 'sys-admin' },
  { name: 'Logistics', id: 'logistics' },
  { name: 'Marketing Manager', id: 'marketing-manager' },
  { name: 'Social Networks', id: 'social-networks' },
  { name: 'Graphics', id: 'graphics' },
  { name: 'Multimedia', id: 'multimedia' },
  { name: 'Communication', id: 'communication' },
  { name: 'Content Producer', id: 'content-producer' },
  { name: 'Content Developer', id: 'content-developer' }
]

options.needed = [
  { name: 'Yes', value: 'true' },
  { name: 'No', value: 'false' }
]

module.exports = options
