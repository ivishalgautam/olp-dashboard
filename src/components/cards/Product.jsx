import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";

export default function ProductCard({ title, picture, id, handleAddTocart }) {
  return (
    <Card className="w-auto">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="relative size-32 mx-auto">
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${picture}`}
            alt={title}
            className="object-cover object-center rounded-lg"
          />
        </div>
      </CardContent>
      <CardFooter className="text-center">
        <Button className="mx-auto" onClick={() => handleAddTocart(id)}>
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}
