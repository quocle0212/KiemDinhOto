export const CAMERA_STATUS = {
  ONLINE: {
    value: 'online',
    label: 'Hoạt động',
    color: 'success'
  },
  OFFLINE: {
    value: 'offline',
    label: 'Không hoạt động',
    color: 'danger'
  }
}

export const CAMERA_BRAND = {
  Dahua: {
    value: 'Dahua',
    label: 'Dahua'
  },
  Hikvision: {
    value: 'Hikvision',
    label: 'Hikvision'
  },
  EZVIZ: {
    value: 'EZVIZ',
    label: 'EZVIZ'
  }
}

export const CAMERA_RESOLUTION = {
  '1280x720': {
    value: '1280x720',
    label: '1280x720'
  },
  '1920x1080': {
    value: '1920x1080',
    label: '1920x1080'
  },
  '2560x1440': {
    value: '2560x1440',
    label: '2560x1440'
  },
  '3840x2160': {
    value: '3840x2160',
    label: '3840x2160'
  }
}

export const CONNECTION_TYPE = {
  FFMPEG: {
    value: 'FFMPEG',
    label: 'FFMPEG'
  },
  VLC: {
    value: 'VLC',
    label: 'VLC'
  },
  JPEG: {
    value: 'JPEG',
    label: 'JPEG'
  }
}

export const CONNECTION_PROTOCOL = {
  HTTP: {
    value: 'HTTP',
    label: 'HTTP'
  },
  RTSP: {
    value: 'RTSP',
    label: 'RTSP'
  }
}
