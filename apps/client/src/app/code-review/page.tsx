'use client';
import ReviewForm from '../components/ReviewForm';

export default function ReviewPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Review a Pull Request</h1>
      <ReviewForm />
    </div>
  );
}
