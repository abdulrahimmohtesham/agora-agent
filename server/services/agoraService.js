const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

function generateAgoraToken({ channelName, uid = 0, role = "publisher", expireTimeInSeconds = 3600 }) {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;
  const rtcRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  if (!appId || !appCertificate) {
    console.warn("[AgoraService] AGORA_APP_ID or AGORA_APP_CERTIFICATE not set. Returning demo channel session config.");
    return {
      appId: appId || "demo-agora-app-id",
      channelName: channelName || "shopping-concierge-live",
      uid,
      token: "mock-agora-rtc-token-" + Date.now(),
      isDemo: true,
      expiresAt: privilegeExpiredTs,
      message: "Running in Sandbox/Demo mode. Add AGORA_APP_ID and AGORA_APP_CERTIFICATE to .env to connect to live Agora RTC production servers."
    };
  }

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      rtcRole,
      privilegeExpiredTs
    );

    return {
      appId,
      channelName,
      uid,
      token,
      isDemo: false,
      expiresAt: privilegeExpiredTs
    };
  } catch (error) {
    console.error("[AgoraService] Error generating token:", error);
    return {
      appId,
      channelName,
      uid,
      token: null,
      error: error.message
    };
  }
}

module.exports = { generateAgoraToken };
