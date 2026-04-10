/**
 * Placeholder database types for Supabase client generics.
 * Replace with `supabase gen types typescript` output when convenient.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type EventStatus = "draft" | "active" | "closed";

export type RegistrationKitStatus = "pending" | "at_desk" | "delivered";

export type EventStaffRole = "admin" | "staff";

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          event_date: string | null;
          starts_at: string | null;
          ends_at: string | null;
          status: EventStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["events"]["Row"]> & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Row"]>;
      };
      desks: {
        Row: {
          id: string;
          event_id: string;
          label: string;
          sort_order: number;
          is_active: boolean;
          external_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          event_id: string;
          label: string;
          sort_order?: number;
          is_active?: boolean;
          external_key?: string | null;
        };
        Update: {
          label?: string;
          sort_order?: number;
          is_active?: boolean;
          external_key?: string | null;
        };
      };
      registrations: {
        Row: {
          id: string;
          event_id: string;
          race_id: string | null;
          kit_type_id: string | null;
          full_name: string;
          birth_date: string | null;
          sex: string | null;
          team: string | null;
          document_id: string | null;
          registration_proof_code: string | null;
          shirt_size: string | null;
          bib_number: string;
          kit_status: RegistrationKitStatus;
          last_called_at: string | null;
          last_desk_id: string | null;
          delivered_at: string | null;
          delivered_by_user_id: string | null;
          search_text: string;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          event_id: string;
          bib_number: string;
          full_name: string;
          search_text: string;
          kit_status?: RegistrationKitStatus;
          race_id?: string | null;
          kit_type_id?: string | null;
          birth_date?: string | null;
          sex?: string | null;
          team?: string | null;
          document_id?: string | null;
          registration_proof_code?: string | null;
          shirt_size?: string | null;
          metadata?: Json | null;
        };
        Update: {
          race_id?: string | null;
          kit_type_id?: string | null;
          full_name?: string;
          birth_date?: string | null;
          sex?: string | null;
          team?: string | null;
          document_id?: string | null;
          registration_proof_code?: string | null;
          shirt_size?: string | null;
          bib_number?: string;
          kit_status?: RegistrationKitStatus;
          last_called_at?: string | null;
          last_desk_id?: string | null;
          delivered_at?: string | null;
          delivered_by_user_id?: string | null;
          search_text?: string;
          metadata?: Json | null;
        };
      };
      races: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          distance_km: number | null;
          wave: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          event_id: string;
          name: string;
          sort_order: number;
          distance_km?: number | null;
          wave?: string | null;
        };
        Update: {
          name?: string;
          distance_km?: number | null;
          wave?: string | null;
          sort_order?: number;
        };
      };
      kit_types: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          event_id: string;
          name: string;
        };
        Update: {
          name?: string;
        };
      };
      kit_items: {
        Row: {
          id: string;
          kit_type_id: string;
          label: string;
        };
        Insert: {
          kit_type_id: string;
          label: string;
        };
        Update: {
          label?: string;
        };
      };
      event_staff: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          role: EventStaffRole;
          created_at: string;
        };
        Insert: {
          event_id: string;
          user_id: string;
          role?: EventStaffRole;
        };
        Update: {
          role?: EventStaffRole;
        };
      };
      event_required_fields: {
        Row: {
          id: string;
          event_id: string;
          field_key: string;
          label: string;
          is_enabled: boolean;
          is_required: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          event_id: string;
          field_key: string;
          label: string;
          is_enabled?: boolean;
          is_required?: boolean;
          sort_order?: number;
        };
        Update: {
          label?: string;
          is_enabled?: boolean;
          is_required?: boolean;
          sort_order?: number;
        };
      };
      desk_display_state: {
        Row: {
          desk_id: string;
          event_id: string;
          registration_id: string | null;
          display_variant: string | null;
          updated_by_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      deliveries: {
        Row: {
          id: string;
          registration_id: string;
          desk_id: string;
          staff_user_id: string;
          delivered_at: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          registration_id: string;
          desk_id: string;
          staff_user_id: string;
          delivered_at: string;
          notes?: string | null;
        };
      };
    };
    Views: {
      tv_desk_tiles: {
        Row: {
          desk_id: string;
          event_id: string;
          desk_label: string;
          desk_sort_order: number;
          desk_external_key: string | null;
          registration_id: string | null;
          display_variant: string | null;
          display_updated_at: string;
          event_name: string;
          bib_number: string | null;
          full_name: string | null;
          race_name: string | null;
          race_distance_km: number | null;
          kit_status: RegistrationKitStatus | null;
          participant_sex: string | null;
          age_group: string | null;
        };
      };
    };
    Enums: {
      event_status: EventStatus;
      registration_kit_status: RegistrationKitStatus;
      event_staff_role: EventStaffRole;
    };
  };
};
