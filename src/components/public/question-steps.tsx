"use client";

import type { Dictionary } from "@/i18n";
import { isSeasonalStay } from "@/lib/applications/stay";
import {
  SelectField,
  TextAreaField,
  TextField,
  YesNoField,
} from "@/components/public/fields";
import type { PublicProperty } from "@/lib/applications/types";

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
}: QuestionProps & { property: PublicProperty | undefined }) {
  const t = dictionary.rentQuestions;

  // A quien viene de temporada no se le hace el estudio de solvencia, asi que
  // tampoco se le piden los ingresos: se le pregunta el motivo, que es lo que
  // el propietario necesita saber de una estancia corta.
  const seasonal = isSeasonalStay(answers);

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

      <SelectField
        label={t.stayLength}
        value={answers.stayLength ?? ""}
        onChange={(value) => {
          setAnswer("stayLength", value);
          // Si deja de tener fecha de salida, no puede quedarse la anterior
          // guardada: decidiria por su cuenta que la estancia es de temporada.
          if (value !== "withEndDate") setAnswer("moveOutDate", "");
        }}
        options={t.stayOptions}
        placeholder={dictionary.common.selectPlaceholder}
        error={errors.stayLength}
        required
      />

      {/* La fecha de salida solo se pide a quien ha dicho que ya la tiene.
          Preguntarsela a quien busca vivienda habitual no tiene sentido y
          ademas le hace dudar de si el alquiler tiene fecha de caducidad. */}
      {answers.stayLength === "withEndDate" ? (
        <TextField
          label={t.moveOutDate}
          type="date"
          value={answers.moveOutDate ?? ""}
          onChange={(value) => setAnswer("moveOutDate", value)}
          error={errors.moveOutDate}
          required
        />
      ) : null}

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

      {seasonal ? (
        <SelectField
          label={t.stayPurpose}
          value={answers.stayPurpose ?? ""}
          onChange={(value) => setAnswer("stayPurpose", value)}
          options={t.stayPurposeOptions}
          placeholder={dictionary.common.selectPlaceholder}
          error={errors.stayPurpose}
          required
        />
      ) : (
        <>
          <YesNoField
            label={t.provableIncome}
            value={answers.provableIncome ?? ""}
            onChange={(value) => setAnswer("provableIncome", value)}
            yesLabel={dictionary.common.yes}
            noLabel={dictionary.common.no}
            error={errors.provableIncome}
          />

          {/*
            Sin ayuda debajo del campo, a proposito. Aqui hubo primero un
            veredicto en vivo ("cumplis" / "no llegais") y despues el criterio
            de solvencia con el importe de referencia para el inmueble. Las dos
            cosas se quitaron: el porcentaje que aplica Artiko es un criterio
            interno (decision de octubre de 2026), y ensenarlo invita a ajustar
            la cifra declarada para pasar el corte. La valoracion se ve solo en
            el panel.
          */}
          <TextField
            label={t.monthlyIncome}
            value={answers.monthlyIncome ?? ""}
            onChange={(value) => setAnswer("monthlyIncome", value)}
            inputMode="numeric"
            error={errors.monthlyIncome}
            required
          />
        </>
      )}

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
  errors,
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
