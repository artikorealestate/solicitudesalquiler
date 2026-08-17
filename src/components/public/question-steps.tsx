"use client";

import type { Dictionary } from "@/i18n";
import { interpolate } from "@/i18n";
import {
  SelectField,
  TextAreaField,
  TextField,
  YesNoField
} from "@/components/public/fields";
import {
  recommendedIncomeFor,
  type PublicProperty
} from "@/lib/applications/types";

type QuestionProps = {
  dictionary: Dictionary;
  answers: Record<string, string>;
  setAnswer: (key: string, value: string) => void;
  errors: Record<string, string>;
};

export function RentQuestions({
  dictionary,
  answers,
  setAnswer,
  errors,
  property
}: QuestionProps & { property: PublicProperty | undefined }) {
  const t = dictionary.rentQuestions;
  const rentPrice = property?.rentPrice ?? null;
  const income = Number(answers.monthlyIncome?.replace(/[.\s]/g, "") ?? "");

  return (
    <div className="space-y-6">
      <TextField
        label={t.householdSize}
        value={answers.householdSize ?? ""}
        onChange={(value) => setAnswer("householdSize", value)}
        inputMode="numeric"
        error={errors.householdSize}
        required
      />

      <SelectField
        label={t.relationship}
        value={answers.relationship ?? ""}
        onChange={(value) => setAnswer("relationship", value)}
        options={t.relationshipOptions}
        placeholder={dictionary.common.selectPlaceholder}
        error={errors.relationship}
        required
      />

      <TextField
        label={t.moveInDate}
        type="date"
        value={answers.moveInDate ?? ""}
        onChange={(value) => setAnswer("moveInDate", value)}
        error={errors.moveInDate}
        required
      />

      <TextField
        label={t.occupation}
        value={answers.occupation ?? ""}
        onChange={(value) => setAnswer("occupation", value)}
        error={errors.occupation}
        required
      />

      <SelectField
        label={t.employmentType}
        value={answers.employmentType ?? ""}
        onChange={(value) => setAnswer("employmentType", value)}
        options={t.employmentOptions}
        placeholder={dictionary.common.selectPlaceholder}
        error={errors.employmentType}
        required
      />

      <YesNoField
        label={t.provableIncome}
        value={answers.provableIncome ?? ""}
        onChange={(value) => setAnswer("provableIncome", value)}
        yesLabel={dictionary.common.yes}
        noLabel={dictionary.common.no}
        error={errors.provableIncome}
      />

      <div>
        <TextField
          label={t.monthlyIncome}
          value={answers.monthlyIncome ?? ""}
          onChange={(value) => setAnswer("monthlyIncome", value)}
          inputMode="numeric"
          error={errors.monthlyIncome}
          hint={
            rentPrice
              ? interpolate(t.solvencyForProperty, {
                  rent: rentPrice.toLocaleString("es-ES"),
                  recommended:
                    recommendedIncomeFor(rentPrice).toLocaleString("es-ES")
                })
              : t.solvencyHelp
          }
          required
        />

        {/*
          Aqui habia un veredicto en vivo ("cumplis" / "no llegais"). Se ha
          quitado a proposito:

          - A quien no llega, le dice que no antes de que Artiko haya visto
            nada. Muchos abandonan ahi, y algunos habrian encajado igualmente
            con aval, ahorros o un segundo titular.
          - El criterio no es una linea nitida: la referencia del sector esta
            entre el 30% y el 45% segun quien la aplique.

          Se conserva el dato objetivo (el importe de referencia) en la ayuda
          del campo, que es lo util: orienta sin juzgar.
        */}
      </div>

      <YesNoField
        label={t.pets}
        value={answers.pets ?? ""}
        onChange={(value) => setAnswer("pets", value)}
        yesLabel={dictionary.common.yes}
        noLabel={dictionary.common.no}
        error={errors.pets}
      />

      {answers.pets === "yes" ? (
        <TextField
          label={t.petsDetail}
          value={answers.petsDetail ?? ""}
          onChange={(value) => setAnswer("petsDetail", value)}
          error={errors.petsDetail}
        />
      ) : null}

      <SelectField
        label={t.searchDuration}
        value={answers.searchDuration ?? ""}
        onChange={(value) => setAnswer("searchDuration", value)}
        options={t.searchDurationOptions}
        placeholder={dictionary.common.selectPlaceholder}
        error={errors.searchDuration}
        required
      />

      <YesNoField
        label={t.visitedOthers}
        value={answers.visitedOthers ?? ""}
        onChange={(value) => setAnswer("visitedOthers", value)}
        yesLabel={dictionary.common.yes}
        noLabel={dictionary.common.no}
        error={errors.visitedOthers}
      />

      <SelectField
        label={t.documentsReady}
        value={answers.documentsReady ?? ""}
        onChange={(value) => setAnswer("documentsReady", value)}
        options={t.documentsReadyOptions}
        placeholder={dictionary.common.selectPlaceholder}
        error={errors.documentsReady}
        required
      />
    </div>
  );
}

export function SaleQuestions({
  dictionary,
  answers,
  setAnswer,
  errors
}: QuestionProps) {
  const t = dictionary.saleQuestions;

  return (
    <div className="space-y-6">
      <TextAreaField
        label={t.buyerProfile}
        value={answers.buyerProfile ?? ""}
        onChange={(value) => setAnswer("buyerProfile", value)}
        hint={t.buyerProfileHint}
        error={errors.buyerProfile}
        required
      />

      <SelectField
        label={t.searchDuration}
        value={answers.searchDuration ?? ""}
        onChange={(value) => setAnswer("searchDuration", value)}
        options={t.searchDurationOptions}
        placeholder={dictionary.common.selectPlaceholder}
        error={errors.searchDuration}
        required
      />

      <TextField
        label={t.propertiesVisited}
        value={answers.propertiesVisited ?? ""}
        onChange={(value) => setAnswer("propertiesVisited", value)}
        inputMode="numeric"
        error={errors.propertiesVisited}
        required
      />

      <YesNoField
        label={t.madeOffer}
        value={answers.madeOffer ?? ""}
        onChange={(value) => setAnswer("madeOffer", value)}
        yesLabel={dictionary.common.yes}
        noLabel={dictionary.common.no}
        error={errors.madeOffer}
      />

      <YesNoField
        label={t.needToSell}
        value={answers.needToSell ?? ""}
        onChange={(value) => setAnswer("needToSell", value)}
        yesLabel={dictionary.common.yes}
        noLabel={dictionary.common.no}
        error={errors.needToSell}
      />

      <YesNoField
        label={t.needsFinancing}
        value={answers.needsFinancing ?? ""}
        onChange={(value) => setAnswer("needsFinancing", value)}
        yesLabel={dictionary.common.yes}
        noLabel={dictionary.common.no}
        error={errors.needsFinancing}
      />

      {/* Solo tiene sentido preguntar por la preaprobacion si necesitan
          financiacion. */}
      {answers.needsFinancing === "yes" ? (
        <YesNoField
          label={t.financingApproved}
          value={answers.financingApproved ?? ""}
          onChange={(value) => setAnswer("financingApproved", value)}
          yesLabel={dictionary.common.yes}
          noLabel={dictionary.common.no}
          hint={t.financingApprovedHint}
          error={errors.financingApproved}
        />
      ) : null}

      <SelectField
        label={t.firstPurchase}
        value={answers.firstPurchase ?? ""}
        onChange={(value) => setAnswer("firstPurchase", value)}
        options={t.firstPurchaseOptions}
        placeholder={dictionary.common.selectPlaceholder}
        error={errors.firstPurchase}
        required
      />

      <TextField
        label={t.occupation}
        value={answers.occupation ?? ""}
        onChange={(value) => setAnswer("occupation", value)}
        error={errors.occupation}
        required
      />
    </div>
  );
}
