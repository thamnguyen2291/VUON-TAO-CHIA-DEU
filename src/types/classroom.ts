export type GroupFormat = 2 | 3 | 4 | 5 | 6;

export interface GroupInfo {
  id: string;
  name: string;
  colorHex: string;
  badgeBg: string;
  ringClass: string;
  score: number;
}

export interface ClassroomConfig {
  groupFormat: GroupFormat;
  classSize: number;
  enableCountdown: boolean;
  countdownDuration: 5 | 10 | 15;
}

export const DEFAULT_CLASSROOM_CONFIG: ClassroomConfig = {
  groupFormat: 2,
  classSize: 35,
  enableCountdown: true,
  countdownDuration: 10,
};

const GROUP_PALETTE = [
  { colorHex: '#2F80D0', badgeBg: 'bg-blue-50 border-blue-200 text-blue-900', ringClass: 'ring-blue-300' },
  { colorHex: '#F07B12', badgeBg: 'bg-orange-50 border-orange-200 text-orange-900', ringClass: 'ring-orange-300' },
  { colorHex: '#8B5CF6', badgeBg: 'bg-purple-50 border-purple-200 text-purple-900', ringClass: 'ring-purple-300' },
  { colorHex: '#EC4899', badgeBg: 'bg-pink-50 border-pink-200 text-pink-900', ringClass: 'ring-pink-300' },
  { colorHex: '#0D9488', badgeBg: 'bg-teal-50 border-teal-200 text-teal-900', ringClass: 'ring-teal-300' },
  { colorHex: '#D97706', badgeBg: 'bg-amber-50 border-amber-200 text-amber-900', ringClass: 'ring-amber-300' },
];

export function createInitialGroups(format: GroupFormat): GroupInfo[] {
  if (format === 2) {
    return [
      {
        id: 'team-blue',
        name: 'Đội Xanh',
        colorHex: '#2F80D0',
        badgeBg: 'bg-blue-50 border-blue-200 text-blue-900',
        ringClass: 'ring-blue-300',
        score: 0,
      },
      {
        id: 'team-orange',
        name: 'Đội Cam',
        colorHex: '#F07B12',
        badgeBg: 'bg-orange-50 border-orange-200 text-orange-900',
        ringClass: 'ring-orange-300',
        score: 0,
      },
    ];
  }

  return Array.from({ length: format }).map((_, idx) => {
    const palette = GROUP_PALETTE[idx % GROUP_PALETTE.length];
    return {
      id: `group-${idx + 1}`,
      name: `Nhóm ${idx + 1}`,
      colorHex: palette.colorHex,
      badgeBg: palette.badgeBg,
      ringClass: palette.ringClass,
      score: 0,
    };
  });
}
