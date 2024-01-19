export default function Wailist() {
  return (
    <div
      id="waitlist"
      className="mx-4 mt-10 mb-32 flex flex-col lg:w-1/2 items-center text-center"
    >
      <div className="text-4xl font-semibold">Get into flow state with us.</div>
      <div className="mt-5 mb-10 w-2/3 text-zinc-300">
        Join <b>500+</b> others on the waitlist for early access to Flowmodor's private beta.
      </div>
      <div
        id="getWaitlistContainer"
        data-waitlist_id="12373"
        data-widget_type="WIDGET_2"
        className="flex justify-center"
      ></div>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css"
      />
      <script src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js"></script>
    </div>
  );
}
