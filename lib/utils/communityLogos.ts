export type CommunityName = 'Ideas y Findes' | 'Ship BA';

export function getCommunityLogo(communityName: CommunityName | string): string {
  const logoMap: Record<CommunityName, string> = {
    'Ideas y Findes': '/if-logo.png',
    'Ship BA': '/shipba-logo.png'
  };

  return logoMap[communityName as CommunityName] || '/default-community-logo.png';
} 