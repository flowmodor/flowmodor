export default async function getAccessToken() {
  try {
    const authUrl = process.env.NEXT_PUBLIC_PAYPAL_AUTH_URL;
    const clientIdAndSecret = `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.NEXT_PUBLIC_PAYPAL_SECRET_CODE}`;
    const base64 = Buffer.from(clientIdAndSecret).toString('base64');

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64}`,
      },
      body: 'grant_type=client_credentials',
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(error);

    return null;
  }
}
