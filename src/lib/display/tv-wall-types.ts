export type TvDeskTileStatus = "processing" | "success" | "idle";

export type TvWallParticipant = {
  bibRaw: string;
  name: string;
  race: string;
  sex: string;
  ageGroup: string;
  kitStatus: string;
};

export type TvWallDeskTileModel = {
  deskId: string;
  deskLabel: string;
  status: TvDeskTileStatus;
  showCheck: boolean;
  participant: TvWallParticipant | null;
};
