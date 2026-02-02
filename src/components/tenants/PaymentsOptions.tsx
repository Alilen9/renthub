type Props = {
  listingId: string;
  amount: number;
};

export default function PaymentOptions({ listingId, amount }: Props) {
  return (
    <div className="space-y-2">
      <p className="font-medium">Listing: {listingId}</p>
      <p>Amount: KES {amount.toLocaleString()}</p>
    </div>
  );
}