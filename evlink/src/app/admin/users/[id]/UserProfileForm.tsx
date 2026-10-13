"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateAdminUserProfile,
  type AdminUserActionState,
} from "../../../../services/actions/actions";

type UserProfileFormProps = {
  userId: string;
  fullName: string;
};

const initialState: AdminUserActionState = {};

export function UserProfileForm({ userId, fullName }: UserProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(fullName);

  const [state, formAction, isPending] = useActionState(
    updateAdminUserProfile.bind(null, userId),
    initialState,
  );

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      return;
    }

    if (state.success) {
      toast.success(state.success);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      <input name="userId" type="hidden" value={userId} />

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="fullName">
          Nombre completo
        </label>

        <Input
          autoComplete="name"
          id="fullName"
          maxLength={120}
          minLength={2}
          name="fullName"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <Button disabled={isPending} type="submit">
        {isPending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
