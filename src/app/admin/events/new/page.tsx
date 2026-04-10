import { EventConfigurationEditor } from "@/components/admin/event-settings/event-configuration-editor";
import { defaultImportRulesState } from "@/lib/event-import-rules";

export default function AdminNewEventPage() {
  return (
    <EventConfigurationEditor
      mode="create"
      eventParam="new"
      initialEvent={null}
      initialImportRules={defaultImportRulesState()}
      initialRaces={[]}
      initialDesks={[]}
      initialKitTypes={[]}
      initialKitItems={[]}
      initialStaff={[]}
      loadError={null}
    />
  );
}
